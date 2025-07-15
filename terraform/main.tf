provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zona
}

resource "google_container_cluster" "primary" {
  name     = "gke-cluster"
  location = var.region
  initial_node_count = 1

  node_config {
    machine_type  = var.tipo_maquina
    disk_size_gb  = 50
    disk_type     = "pd-standard"
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    machine_type  = var.tipo_maquina
    disk_size_gb  = 50
    disk_type     = "pd-standard"
  }
}

