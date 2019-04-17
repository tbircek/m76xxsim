# Recloser Simulator #

A recloser is an automatic, high-voltage electric switch. Like a circuit breaker on household electric lines, it shuts off electric power when trouble occurs, such as a short circuit.

### What will you need? ###

* [Beaglebone](https://beagleboard.org/black)


### Preparing Beaglebone for Recloser Simulator: ###

1. Update debian to v9.4 follow steps in "[Getting Started](https://beagleboard.org/getting-started#update)".   
    ```
    https://beagleboard.org/getting-started#update
    ```

2. Connect Beaglebone to internet and clone [this](https://bitbucket.org/tbircek/m76xxsim.git) repository.   
    ``` 
    git clone https://bitbucket.org/tbircek/m76xxsim.git
    ```

3. Install required npm modules.   
    ```
    npm install
    ```

4. Set time zone for logging.   
    ```
    $ sudo timedatectl set-timezone America/New_York
    ```

5. Verify required node modules installed correctly.   
    ```
    npm test
    ```

6. Follow instructions to install [HAProxy](https://haproxy.debian.net). (currently v1.7.5-2).   
    ```
    https://haproxy.debian.net
    ```

7. Move [haproxy.cfg](m76xxsim/haproxy.cfg) to /etc/haproxy folder and verify HAProxy service started if not start the service.   
    ```
    $ sudo mv haproxy.cfg /etc/haproxy    
    $ systemctl status haproxy.service    
    $ sudo systemctl start haproxy.service
    ```

8. Move [m76xxsim.service](m76xxsim/m76xxsim.service) to /lib/systemd/system folder.   
    ```
    $ sudo mv m76xxsim.service /lib/systemd/system
    ```
    
9. Reload systemd manager configuration.  
    ```
    $ sudo systemctl daemon-reload
    ```

10. Enable M76xxsim service to automatically start on boot.   
    ```
    $ sudo systemctl enable m76xxsim.service
    ```

11. Restart Beaglebone.   
    ```
    $ sudo reboot now
    ```

12. After reboot completed connect to Beaglebone using a browser with ipaddress presented on LCD.  
(Initial web page load could take up to 20 seconds.)

### Contact Us ###

* [Contact us](http://www.beckwithelectric.com/)