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

  service_registries {
    registry_arn = aws_service_discovery_service.chat.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

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
      container_port  = 80
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
# ECS Service - File Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "file" {
  name                               = aws_ecs_task_definition.file.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.file.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.file.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - File Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "file" {
  family             = "${var.prefix}-file"
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
      container_name  = "${var.prefix}-file"
      container_image = "${module.ecr_file.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - File Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "file" {
  task_definition = aws_ecs_task_definition.file.family
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Image Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "image" {
  name                               = aws_ecs_task_definition.image.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = data.aws_ecs_task_definition.image.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.image.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Image Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "image" {
  family             = "${var.prefix}-image"
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
      container_name  = "${var.prefix}-image"
      container_image = "${module.ecr_image.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Image Service Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "image" {
  task_definition = aws_ecs_task_definition.image.family
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Predict Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "predict" {
  name                               = aws_ecs_task_definition.predict.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.predict.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.predict.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Predict Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "predict" {
  family             = "${var.prefix}-predict"
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
      container_name  = "${var.prefix}-predict"
      container_image = "${module.ecr_predict.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Rag Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "rag" {
  name                               = aws_ecs_task_definition.rag.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.rag.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.rag.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

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
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Share Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "share" {
  name                               = aws_ecs_task_definition.share.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.share.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.rag.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Share Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "share" {
  family             = "${var.prefix}-share"
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
      container_name  = "${var.prefix}-share"
      container_image = "${module.ecr_share.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# ECS Service - SystemContexts Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "systemcontexts" {
  name                               = aws_ecs_task_definition.systemcontexts.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.systemcontexts.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.systemcontexts.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - SystemContexts Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "systemcontexts" {
  family             = "${var.prefix}-systemcontexts"
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
      container_name  = "${var.prefix}-systemcontexts"
      container_image = "${module.ecr_systemcontexts.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Transcribe Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "transcribe" {
  name                               = aws_ecs_task_definition.transcribe.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.transcribe.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.transcribe.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Transcribe Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "transcribe" {
  family             = "${var.prefix}-transcribe"
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
      container_name  = "${var.prefix}-transcribe"
      container_image = "${module.ecr_rag.repository_url}:latest"
      container_port  = 80
    }
  )
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Webtext Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "webtext" {
  name                               = aws_ecs_task_definition.webtext.family
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "LATEST"
  task_definition                    = aws_ecs_task_definition.webtext.arn
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

  service_registries {
    registry_arn = aws_service_discovery_service.webtext.arn
    port         = 8080
  }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Webtext Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "webtext" {
  family             = "${var.prefix}-webtext"
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
      container_name  = "${var.prefix}-webtext"
      container_image = "${module.ecr_rag.repository_url}:latest"
      container_port  = 80
    }
  )
}


