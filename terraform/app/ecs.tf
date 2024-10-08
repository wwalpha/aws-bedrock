# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "this" {
  name = "${var.prefix}-cluster"
}

# ----------------------------------------------------------------------------------------------
# ECS Cluster Capacity Providers
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 0
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Chat Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "chat" {
  name                               = aws_ecs_task_definition.chat.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.chat.arn
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false
  scheduling_strategy                = "REPLICA"
  enable_ecs_managed_tags            = true
  force_new_deployment               = true

  triggers = {
    redeployment = plantimestamp()
  }

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = false
    rollback = false
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    assign_public_ip = false
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.this.arn

    service {
      port_name = "chat_service"
      client_alias {
        port = 80
      }
    }
  }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Chat Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "chat" {
  family             = "${var.prefix}-chat"
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  container_definitions = templatefile(
    "${path.module}/taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = "${var.prefix}-chat"
      container_image = "${module.ecr_chat.repository_url}:latest"
      container_port  = 8080
      env_file_arn    = aws_s3_object.chat.arn
      port_name       = "chat_service"
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Chat Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "chat" {
  task_definition = aws_ecs_task_definition.chat.family
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Functions Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "functions" {
  name                               = aws_ecs_task_definition.functions.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.functions.arn
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false
  scheduling_strategy                = "REPLICA"
  enable_ecs_managed_tags            = true
  force_new_deployment               = true

  triggers = {
    redeployment = plantimestamp()
  }

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = false
    rollback = false
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    assign_public_ip = false
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.this.arn

    service {
      port_name = "functions_service"
      client_alias {
        port = 80
      }
    }
  }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Functions Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "functions" {
  family             = "${var.prefix}-functions"
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  container_definitions = templatefile(
    "${path.module}/taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = "${var.prefix}-functions"
      container_image = "${module.ecr_functions.repository_url}:latest"
      container_port  = 8080
      env_file_arn    = aws_s3_object.functions.arn
      port_name       = "functions_service"
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Functions Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "functions" {
  task_definition = aws_ecs_task_definition.functions.family
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Rag Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "rag" {
  name                               = aws_ecs_task_definition.rag.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.rag.arn
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false
  scheduling_strategy                = "REPLICA"
  enable_ecs_managed_tags            = true
  force_new_deployment               = true

  triggers = {
    redeployment = plantimestamp()
  }

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = false
    rollback = false
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    assign_public_ip = false
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_private_dns_namespace.this.arn

    service {
      port_name = "rag_service"
      client_alias {
        port = 80
      }
    }
  }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Rag Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "rag" {
  family             = "${var.prefix}-rag"
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  container_definitions = templatefile(
    "${path.module}/taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = "${var.prefix}-rag"
      container_image = "${module.ecr_rag.repository_url}:latest"
      container_port  = 8080
      env_file_arn    = aws_s3_object.functions.arn
      port_name       = "rag_service"
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Rag Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "rag" {
  task_definition = aws_ecs_task_definition.rag.family
}

