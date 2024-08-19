# # ----------------------------------------------------------------------------------------------
# # AWS IAM Role - CustomCrossRegionExportWriterCustomResource
# # ----------------------------------------------------------------------------------------------
# resource "aws_iam_role" "custom_cross_region_export_writer_custom_resource" {
#   name               = "${var.prefix}_CustomCrossRegionExportWriterCustomResourceRole"
#   assume_role_policy = data.aws_iam_policy_document.lambda.json
# }

# # ----------------------------------------------------------------------------------------------
# # AWS IAM Role Policy - CustomCrossRegionExportWriterCustomResource
# # ----------------------------------------------------------------------------------------------
# resource "aws_iam_role_policy_attachment" "custom_cross_region_export_writer_custom_resource_lambda_basic" {
#   role       = aws_iam_role.custom_cross_region_export_writer_custom_resource.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }
