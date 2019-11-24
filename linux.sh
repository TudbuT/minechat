echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating NodeJS and npm"
yes Y | apt-get update>ilog.txt 2>&1
yes Y | apt-get install npm>>ilog.txt 2>&1
yes Y | apt-get install nodejs>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating libraries"
npm install n>>ilog.txt 2>&1
npm install -g npm>>ilog.txt 2>&1
npm install minecraft-protocol>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Searching for updates"
git config user.email "x@y.z"
git config user.name "XYZ"
git pull https://github.com/tudbut/minechat.git>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m All libraries should be installed now"
#echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Creating terminal command 'minechat' (this requires administrator)"
#sudo echo `cd ${PWD}`>/bin/minechat
#sudo echo `bash run.sh`>>/bin/minechat
#sudo chmod +x /bin/minechat
echo -e "\e[48;5;10m\e[38;5;0m[!]\e[0m You can now configure MineChat! Use `cd minechat` and then `mcedit data.json`"
echo -e "\e[48;5;10m\e[38;5;0m[!]\e[0m Then you can finally start it using `bash run [<serverip:serverport>]` - If you don't define serverip and serverport, it will take it from data.json."
