resource "google_compute_firewall" "allow-front-back" {
    name    = "allow-front-back"
    network = google_compute_network.main.name

    allow {
        protocol = "tcp"
        ports    = ["8000","4040"]
    }

    source_ranges = ["0.0.0.0/0"]
}