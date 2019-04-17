# Recloser Simulator #

A recloser is an automatic, high-voltage electric switch. Like a circuit breaker on household electric lines, it shuts off electric power when trouble occurs, such as a short circuit.

### What will you need? ###

* [Beaglebone](https://beagleboard.org/black)


### Preparing Beaglebone for Recloser Simulator: ###

1. Update debian to v9.4 follow steps in "[Getting Started](https://beagleboard.org/getting-started#update)".   
    ```https://beagleboard.org/getting-started#update```   

2. Disable following services and sockets.   
    ```$ sudo systemctl disable apache2.service```   
    ```$ sudo systemctl disable avahi-daemon.service```   
    ```$ sudo systemctl disable avahi-daemon.socket```   
    ```$ sudo systemctl disable bb-wl18xx-bluetooth.service```       
    ```$ sudo systemctl disable bluetooth.service```       
    ```$ sudo systemctl disable bonescript-autorun.service```   
    ```$ sudo systemctl disable bonescript.socket```   
    ```$ sudo systemctl disable node-red.socket```   
    ```$ sudo systemctl disable pppd-dns.service```   
    ```$ sudo systemctl disable ssh.service```   

3. Connect Beaglebone to internet and clone [this](https://bitbucket.org/tbircek/m76xxsim.git) repository.   
    ```git clone https://bitbucket.org/tbircek/m76xxsim.git```   

4. Install required npm modules.   
    ```npm install```   

5. Set time zone for logging.   
    ```$ sudo timedatectl set-timezone America/New_York```   

6. Verify required node modules installed correctly.   
    ```npm test```   

7. Follow instructions to install [HAProxy](https://haproxy.debian.net). (currently v1.7.5-2).   
    ```https://haproxy.debian.net```   

8. Move [haproxy.cfg](m76xxsim/haproxy.cfg) to /etc/haproxy folder and verify HAProxy service started if not start the service.   
    ```$ sudo mv haproxy.cfg /etc/haproxy```   
    ```$ systemctl status haproxy.service```   
    ```$ sudo systemctl start haproxy.service```   

9. Move [m76xxsim.service](m76xxsim/m76xxsim.service) to /lib/systemd/system folder.   
    ```$ sudo mv m76xxsim.service /lib/systemd/system```   

10. Reload systemd manager configuration.  
    ```$ sudo systemctl daemon-reload```   

11. Enable M76xxsim service to automatically start on boot.   
    ```$ sudo systemctl enable m76xxsim.service```   

12. Restart Beaglebone.   
    ```$ sudo shutdown -r now```   

13. After reboot completed connect to Beaglebone using a browser with ipaddress presented on LCD.  
(Initial web page load could take up to 20 seconds.)   
    ```http://localhostipaddress```   

### Contact Us ###

* [Contact us](http://www.beckwithelectric.com/)