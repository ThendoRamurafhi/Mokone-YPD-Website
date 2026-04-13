# Read Me First
The following was discovered as part of building this project:

* The original package name 'com.ame-ypd-backend' is invalid and this project uses 'com.ame_ypd_backend' instead.

# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/4.0.3/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/4.0.3/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/4.0.3/reference/web/servlet.html)
* [Spring Data JPA](https://docs.spring.io/spring-boot/4.0.3/reference/data/sql.html#data.sql.jpa-and-spring-data)
* [Spring Security](https://docs.spring.io/spring-boot/4.0.3/reference/web/spring-security.html)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/4.0.3/reference/using/devtools.html)
* [Validation](https://docs.spring.io/spring-boot/4.0.3/reference/io/validation.html)
* [Java Mail Sender](https://docs.spring.io/spring-boot/4.0.3/reference/io/email.html)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
* [Validation](https://spring.io/guides/gs/validating-form-input/)
* [Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

### Set Up Gmail App Password

This is required for Gmail SMTP to work. Regular passwords are blocked by Google.

1. Go to your Google Account → **Security**
2. Make sure **2-Step Verification** is ON
3. Search for **"App passwords"** in the search bar
4. Select app: **Mail**, device: **Windows Computer**
5. Click **Generate**
6. Copy the 16-character password it gives you
7. Paste it into `application.properties` as `spring.mail.password`

---

## Testing Email

Email is harder to test with Postman alone since it sends in the background. Here's how to verify it's working:

**1. Register a new user** with a real email address you can check:
- `POST` `http://localhost:8080/api/v1/auth/register`
- Use your actual email in the `email` field
- Check your inbox — you should receive the welcome email

**2. Submit a guest RSVP** with a real email:
- `POST` `http://localhost:8080/api/v1/events/1/rsvp/guest`
- Use your actual email as `guestEmail`
- Check your inbox for the RSVP confirmation

**3. Submit a prayer request** with a real email:
- Check inbox for prayer confirmation email

---

## If Email Fails to Send

Don't panic — if Gmail rejects the connection, your app will still work perfectly. Email failure is caught and logged silently — users still get their data back, just no email. Check the terminal for:
```
Failed to send RSVP email: ...