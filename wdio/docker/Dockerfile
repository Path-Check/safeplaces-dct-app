# Credit https://github.com/henrrich/docker-sauce-connect/
FROM debian:jessie
ENV workdir /usr/local/sauce-connect
ARG SC_VERSION=4.5.4
WORKDIR ${workdir}
RUN apt-get update && apt-get install -y \
    wget
RUN wget https://saucelabs.com/downloads/sc-$SC_VERSION-linux.tar.gz -O - | tar -xz
RUN mv sc-$SC_VERSION-linux/* ./ && rm -rf sc-$SC_VERSION-linux
RUN export SC=$workdir
ADD start.sh $workdir
RUN chmod a+x $workdir/start.sh
ENTRYPOINT ["/usr/local/sauce-connect/start.sh"]
CMD ["--help"]