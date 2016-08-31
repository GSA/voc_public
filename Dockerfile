FROM ctac/ruby-base:2.2

ARG RAILS_ENV=production
ENV APP_HOME /voc

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  git \
  zip unzip \
  build-essential \
  && apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY Gemfile* /tmp/
WORKDIR /tmp
RUN bundle install --without test development

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
RUN mkdir log

EXPOSE 80

COPY vendor/s6-overlay-amd64.tar.gz /tmp/s6-overlay-amd64.tar.gz
ADD  https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem /etc/ssl/certs/rds-combined-ca-bundle.pem

RUN tar xfz /tmp/s6-overlay-amd64.tar.gz -sC / \
    && rm /tmp/s6-overlay-amd64.tar.gz

# Inject Consul Template
ENV CONSUL_TEMPLATE_VERSION 0.15.0

## S6 managed consul-template to generate env files

ADD https://releases.hashicorp.com/consul-template/${CONSUL_TEMPLATE_VERSION}/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip /

RUN unzip -d / /consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip && \
    mv /consul-template /usr/local/bin/consul-template &&\
    rm -rf /consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip && \
    mkdir -p /consul-template /consul-template/config.d /consul-template/templates

COPY consul-template/config.d /consul-template/config.d/
COPY consul-template/templates /consul-template/templates/

COPY s6/unicorn /etc/services.d/unicorn
COPY s6/consul-template /etc/services.d/consul-template

# DON'T CLEAN UP INTERMEDIARY IMAGES. DEPENDENT BUILD. MODIFY ONLY BELOW.

RUN rm -f tmp/pids/unicorn.pid tmp/pids/server.pid

#ENTRYPOINT [ "unicorn", "-c", "config/unicorn.rb" ]
CMD [ "/init" ]
