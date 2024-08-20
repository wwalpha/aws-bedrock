# ----------------------------------------------------------------------------------------------
# Service Discovery Private DNS Namespace
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "${var.prefix}.local"
  description = "${var.prefix}.local"
  vpc         = module.vpc.vpc_id
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Chat Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "chat" {
  name = "chat"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - File Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "file" {
  name = "file"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Image Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "image" {
  name = "image"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Predict Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "predict" {
  name = "predict"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Rag Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "rag" {
  name = "rag"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Share Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "share" {
  name = "share"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - SystemContexts Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "systemcontexts" {
  name = "systemcontexts"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Transcribe Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "transcribe" {
  name = "transcribe"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Webtext Service
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "webtext" {
  name = "webtext"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

