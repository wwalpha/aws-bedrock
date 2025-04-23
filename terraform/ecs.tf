# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "this" {
  name = "${local.prefix}-cluster"
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
# AWS ECS Service - Auth Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "auth" {
  family             = local.task_def_family_auth
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  container_definitions = templatefile(
    "taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = local.task_def_family_auth
      container_image = "${module.ecr_repo_auth.repository_url}:latest"
      container_port  = 8080
      env_file_arn    = "${aws_s3_bucket.materials.arn}/${aws_s3_object.auth.key}"
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Auth Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "auth" {
  task_definition = aws_ecs_task_definition.auth.family
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Auth Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "auth" {
  depends_on                         = [aws_ecs_cluster.this, module.ecr_repo_auth]
  name                               = aws_ecs_task_definition.auth.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 0
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.auth.arn
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false
  scheduling_strategy                = "REPLICA"
  enable_ecs_managed_tags            = true

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_controller {
    type = "ECS"
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_http_namespace.auth.name

    service {
      port_name = "auth"
      client_alias {
        dns_name = "bedrock.auth"
        port     = 8080
      }
    }
  }

  network_configuration {
    assign_public_ip = false
    subnets          = var.vpc_subnets
    security_groups  = [module.inbound_endpoint_sg.security_group_id]
  }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}
