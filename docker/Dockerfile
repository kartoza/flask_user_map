#-------------- Base System Config ------------------------------------------
FROM ubuntu:12.04
RUN  export DEBIAN_FRONTEND=noninteractive
ENV  DEBIAN_FRONTEND noninteractive
RUN  dpkg-divert --local --rename --add /sbin/initctl
RUN  ln -s /bin/true /sbin/initctl
# Set the pwd of root to 'inasafe'
RUN echo "root:usermap" | chpasswd


#-------------- Apt Config --------------------------------------------------
# Use this if deploying on a Hetzner server
#ADD hetzner-sources.list /etc/apt/sources.list
# Otherwise this:
ADD sources.list /etc/apt/sources.list

#-------------- Add user for web app ----------------------------------------
RUN adduser --home=/home/web --gecos 'user_map' web

#-------------- Install deps ------------------------------------------------
RUN apt-get update
RUN apt-get -y install git
RUN apt-get -y install python-virtualenv
RUN apt-get -y install python-dev build-essential
RUN pip install uwsgi
RUN apt-get -y install nginx
RUN apt-get -y install supervisor

#-------------- Check out the sources from GIT ------------------------------
# We should actually be able to run git clone here but it didnt work using RUN
# so we delegate the work to a script rather.
# The script below also
ADD docker/post-setup.sh /home/web/
RUN /home/web/post-setup.sh

#-------------- Clean up any junk ----------------------
RUN apt-get -y purge build-essential
RUN apt-get -y autoremove

# Define which ports get made public
EXPOSE 8082:80
CMD ["/usr/bin/supervisord", "-n"] -D
