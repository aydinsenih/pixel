echo *******Starting*******
git status
git add .
echo *******All files added to commit*******
read -p 'Type commit message: ' message
git commit -m "$message"
git push origin main
echo *******Your commit\(s\) pushed to main branch*******