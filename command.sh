SSH_KEY_PATH="./windows.pem"
EC2_USER="ubuntu"
EC2_HOST="ec2-13-235-70-140.ap-south-1.compute.amazonaws.com"
TARGET_DIR="/home/ubuntu/stackehub/Stackehub-backend"
REPO_URL="git@github.com:apurve53/Assingment"

ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST << EOF

cd $TARGET_DIR
git pull $REPO_URL

EOF