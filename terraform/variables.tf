# ----------------------------------------------------------------------------------------------
# Project Name
# ----------------------------------------------------------------------------------------------
variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "bedrock"
}

# ----------------------------------------------------------------------------------------------
# Subnets
# ----------------------------------------------------------------------------------------------
variable "vpc_id" {
  description = "The ID of the VPC where the security group will be created."
  type        = string
  default     = "vpc-08f77b07c34029b7a"
}

# ----------------------------------------------------------------------------------------------
# Subnets
# ----------------------------------------------------------------------------------------------
variable "vpc_subnets" {
  description = "The list of subnet IDs where the ECS service will be deployed."
  type        = list(string)
  default     = ["subnet-003cfdcdbaf257d95", "subnet-0221940ce594a9f84"]
}
