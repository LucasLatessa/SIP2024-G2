variable "project_id" {
  description = "ID del proyecto de GCP"
  type        = string
  default     = "psychic-expanse-465922-f0"
}

variable "tipo_maquina" {
  type    = string
  default = "e2-small"
}

variable "region" {
  description = "Región de GCP"
  type        = string
  default     = "us-east4"
}

variable "zona" {
  type    = string
  default = "us-east4-a"
}

