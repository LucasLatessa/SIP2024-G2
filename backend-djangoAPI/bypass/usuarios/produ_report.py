def produ_report(request, pk):
    try:
        productora = Productora.objects.get(pk=pk)
    except Productora.DoesNotExist:
        return JsonResponse({'error': 'La productora no existe'}, status=404)

    eventos = Evento.objects.filter(productora=productora)

    total_entradas_vendidas = 0
    total_ganancia = 0
    total_asistencia = 0
    total_entradas = 0
    total_transferencias = 0
    total_tickets_transferidos = 0
    total_regalos = 0
    total_reventas = 0

    eventos_data = []

    for evento in eventos:
        tickets_evento = Ticket.objects.filter(evento=evento)
        tickets_vendidos_qs = tickets_evento.filter(propietario__isnull=False)

        tickets_totales = tickets_evento.count()
        vendidos_count = tickets_vendidos_qs.count()
        disponibles = tickets_totales - vendidos_count

        # Solo tipos presentes en este evento
        tipos_presentes = (
            tickets_evento
            .exclude(tipo_ticket__isnull=True)
            .values_list("tipo_ticket__tipo", flat=True)
            .distinct()
        )
        entradas_por_tipo = {
            tipo: tickets_vendidos_qs.filter(tipo_ticket__tipo=tipo).count()
            for tipo in tipos_presentes
        }

        ganancia_total = tickets_vendidos_qs.aggregate(s=Sum("precioInicial"))["s"] or 0
        asistencia_total = tickets_vendidos_qs.filter(usada=True).count()

        tasa_venta = (vendidos_count / tickets_totales) if tickets_totales else 0
        tasa_asistencia = (asistencia_total / vendidos_count) if vendidos_count else 0
        no_show = vendidos_count - asistencia_total
        ingreso_prom_ticket = (ganancia_total / vendidos_count) if vendidos_count else 0

        # Transferencias
        tickets_transferidos = 0
        transferencias_total = 0
        regalos_total = 0
        reventas_total = 0

        for tk in tickets_vendidos_qs.only("historial_propietarios"):
            h = tk.historial_propietarios or []

            n_regalo = sum(1 for m in h if m.get("motivo") == "regalo")
            n_pub = sum(1 for m in h if m.get("motivo") == "publicidad")
            n_transf = n_regalo + n_pub

            if n_transf > 0:
                tickets_transferidos += 1
                transferencias_total += n_transf
                regalos_total += n_regalo
                reventas_total += n_pub

        # Totales productora
        total_entradas_vendidas += vendidos_count
        total_entradas += tickets_totales
        total_ganancia += ganancia_total
        total_asistencia += asistencia_total
        total_transferencias += transferencias_total
        total_tickets_transferidos += tickets_transferidos
        total_regalos += regalos_total
        total_reventas += reventas_total

        # Precios
        precios_evento = Precio.objects.filter(ticket__evento=evento)
        precios_resumen = precios_evento.aggregate(
            cambios_total=Count("id_Precio"),
            primera_reval=Min("fechaInicial"),
            ultima_reval=Max("fechaInicial"),
        )

        tickets_revalorizados = (
            precios_evento.values("ticket_id").distinct().count()
        )

        eventos_data.append({
            "evento": evento.nombre,
            "tickets_totales": tickets_totales,
            "tickets_vendidos": vendidos_count,
            "tickets_disponibles": disponibles,
            "tasa_venta": tasa_venta,
            "entradas_por_tipo": entradas_por_tipo,
            "ingreso_promedio_ticket": ingreso_prom_ticket,
            "ganancia_total": ganancia_total,
            "asistencia_total": asistencia_total,
            "tasa_asistencia": tasa_asistencia,
            "no_show": no_show,
            "transferencias": {
                "tickets_transferidos": tickets_transferidos,
                "transferencias_total": transferencias_total,
                "regalos_total": regalos_total,
                "reventas_total": reventas_total,
            },
            "revalorizaciones": {
              "cambios_total": precios_resumen["cambios_total"] or 0,
              "tickets_revalorizados": tickets_revalorizados,
              "primera_reval": precios_resumen["primera_reval"],
              "ultima_reval": precios_resumen["ultima_reval"]
            }
        })

    reporte = {
        "productora": productora.nickname,
        "numero_eventos": eventos.count(),
        "eventos": eventos_data,
        "total_entradas": total_entradas,
        "total_entradas_vendidas": total_entradas_vendidas,
        "total_ganancia": total_ganancia,
        "total_asistencia": total_asistencia,
        "total_transferencias": total_transferencias,
        "total_tickets_transferidos": total_tickets_transferidos,
        "total_regalos": total_regalos,
        "total_reventas": total_reventas,
        "tasa_asistencia_global": (total_asistencia / total_entradas_vendidas) if total_entradas_vendidas else 0
    }

    return JsonResponse(reporte)