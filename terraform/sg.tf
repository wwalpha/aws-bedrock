# ----------------------------------------------------------------------------------------------
# AWS Security Group - ECS Security Group
# ----------------------------------------------------------------------------------------------
module "inbound_endpoint_sg" {
  source = "terraform-aws-modules/security-group/aws"
  name   = "${local.prefix}_inbound_endpoint_sg"
  vpc_id = var.vpc_id

  ingress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  egress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group - ECS Security Group
# ----------------------------------------------------------------------------------------------
module "sg_vpc_link" {
  source = "terraform-aws-modules/security-group/aws"
  name   = "${local.prefix}_vpclink_sg"
  vpc_id = var.vpc_id

  ingress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  egress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}
