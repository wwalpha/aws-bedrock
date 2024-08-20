# ----------------------------------------------------------------------------------------------
# AWS VPC
# ----------------------------------------------------------------------------------------------
module "vpc" {
  source               = "terraform-aws-modules/vpc/aws"
  name                 = "${var.prefix}-vpc"
  cidr                 = local.vpc_cidr_block
  azs                  = local.vpc_availability_zones
  private_subnets      = local.vpc_subnets_cidr_block_private
  public_subnets       = local.vpc_subnets_cidr_block_public
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group
# ----------------------------------------------------------------------------------------------
resource "aws_security_group" "private_link" {
  name        = "allow_private"
  description = "allow_private"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_private"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group - ECS
# ----------------------------------------------------------------------------------------------
resource "aws_security_group" "ecs_default_sg" {
  name        = "allow_http"
  description = "allow_http"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 15000
    to_port     = 15000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_http"
  }
}
