[
  {
    "name": "${container_name}",
    "image": "${container_image}",
    "essential": true,
    "environmentFiles": [
      {
        "value": "${env_file_arn}",
        "type": "s3"
      }
    ],
    "portMappings": [
      {
        "name": "${port_name}",
        "containerPort": ${container_port},
        "protocol": "tcp"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "secretOptions": null,
      "options": {
        "awslogs-create-group": "true",
        "awslogs-group": "/ecs/${container_name}",
        "awslogs-region": "${aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]