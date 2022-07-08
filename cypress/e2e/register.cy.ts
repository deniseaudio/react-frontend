describe("register view specs", () => {
  it("should display the register form", () => {
    cy.visit("/");
    cy.contains("button", "Create an account").click();
    cy.contains("button", "Register");
  });

  it("can't create an account if the fields are empty", () => {
    cy.visit("/");
    cy.contains("button", "Create an account").click();
    cy.contains("button", "Register").click();
    cy.contains("p", "This field is required.");
  });

  it("can't create an account if secret-key is invalid", () => {
    cy.intercept("/api/user/register", {
      statusCode: 401,
      body: {},
    });

    cy.visit("/");

    cy.contains("button", "Create an account").click();
    cy.get("input#username").type("username");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("azerty123");
    cy.get("input#secret-key").type("50e0172aea0b");
    cy.contains("button", "Register").click();
    cy.contains("p", "The provided secret-key is invalid.");
  });

  it("can't create an account if email is already used", () => {
    cy.intercept("/api/user/register", {
      statusCode: 409,
      body: {},
    });

    cy.visit("/");

    cy.contains("button", "Create an account").click();
    cy.get("input#username").type("username");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("azerty123");
    cy.get("input#secret-key").type("50e0172aea0b");
    cy.contains("button", "Register").click();
    cy.contains("p", "Email or username already in use.");
  });

  it("can't create an account if an unexpected error happens", () => {
    cy.intercept("/api/user/register", {
      statusCode: 400,
      body: {},
    });

    cy.visit("/");

    cy.contains("button", "Create an account").click();
    cy.get("input#username").type("username");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("azerty123");
    cy.get("input#secret-key").type("50e0172aea0b");
    cy.contains("button", "Register").click();
    cy.contains("p", "Something went wrong, please try again later.");
  });

  it("can create an account if all the fields are filled", () => {
    cy.intercept("/api/user/register", {
      statusCode: 200,
      fixture: "login.json",
    });

    cy.visit("/");

    cy.contains("button", "Create an account").click();
    cy.get("input#username").type("username");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("azerty123");
    cy.get("input#secret-key").type("50e0172aea0b");
    cy.contains("button", "Register").click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/audio-player");
    });
  });
});
