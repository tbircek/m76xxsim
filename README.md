# Recloser Simulator #

A recloser is an automatic, high-voltage electric switch.   
Like a circuit breaker on household electric lines, it shuts off electric power when trouble occurs, such as a short circuit.

### What will you need? ###

* [Beaglebone](https://beagleboard.org/black)
* [Red Board](https://easyeda.com/tbircek_beckwith/m76xxsim)


### Preparing Beaglebone for Recloser Simulator: ###

1. Update debian to v9.4 follow steps in "[Getting Started](https://beagleboard.org/getting-started#update)".   
    ```https://beagleboard.org/getting-started#update```   

2. Change default user password.   
    ```sudo passwd debian```   

3. Set time zone for logging.   
    ```sudo timedatectl set-timezone America/New_York```   

4. Disable following services and sockets.   
    ```sudo systemctl disable apache2.service```   
    ```sudo systemctl disable avahi-daemon.service```   
    ```sudo systemctl disable avahi-daemon.socket```   
    ```sudo systemctl disable bb-wl18xx-bluetooth.service```       
    ```sudo systemctl disable bluetooth.service```       
    ```sudo systemctl disable bonescript-autorun.service```   
    ```sudo systemctl disable bonescript.socket```   
    ```sudo systemctl disable node-red.socket```   
    ```sudo systemctl disable pppd-dns.service```   
    ```sudo systemctl disable ssh.service```   

5. Change directory to "/var/lib/cloud9"   
    ```cd /var/lib/cloud9```   
    
6. Connect Beaglebone to internet and clone [this](https://bitbucket.org/tbircek/m76xxsim.git) repository.   
    ```git clone https://bitbucket.org/tbircek/m76xxsim.git```   

7. Change the directory and install required npm modules.   
    ```cd m76xxsim```   
    ```npm install```   
 
8. Verify required node modules installed correctly.   
    ```npm test```   

9. Delete test logs.   
    ```sudo rm -rf /var/lib/cloud9/m76xxsim/public/logs```   

10. Install [HAProxy](https://haproxy.debian.net) is a reverse proxy allows the server to run on port 80.   
    ```sudo apt-get update```   
    ```sudo apt-get install haproxy=1.7.\*```   
    
11. Move [haproxy.cfg](https://bitbucket.org/tbircek/m76xxsim/src/master/haproxy.cfg) to "/etc/haproxy" folder and verify HAProxy service started if not start the service.   
    ```sudo mv haproxy.cfg /etc/haproxy```   
    ```systemctl status haproxy.service```   
    ```sudo systemctl start haproxy.service```   

12. Move [m76xxsim.service](https://bitbucket.org/tbircek/m76xxsim/src/m76xxsim.service) to "/lib/systemd/system" folder.   
    ```sudo mv m76xxsim.service /lib/systemd/system```   

13. Reload systemd manager configuration.  
    ```sudo systemctl daemon-reload```   

14. Enable M76xxsim service to automatically start on boot.   
    ```sudo systemctl enable m76xxsim.service```   

15. Restart Beaglebone.   
    ```sudo shutdown -r now```   

16. After reboot completed connect to Beaglebone using a browser with ipaddress presented on LCD.  
(Initial web page load could take up to 20 seconds.)   
    ```http://localhostipaddress```   

### Contact Us ###

* [Contact us](http://www.beckwithelectric.com/)