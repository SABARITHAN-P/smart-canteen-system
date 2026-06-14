FROM tomcat:10.1-jdk17

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy custom context.xml to Tomcat configuration
COPY context.xml /usr/local/tomcat/conf/context.xml

# Copy your WAR
COPY SmartCanteen.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]