describe("login view specs", () => {
  it("can't login if fields are empty", () => {
    cy.visit("/");
    cy.get("button").contains("Sign in").click();
    cy.contains("p", "This field is required");
    cy.get("form").should("exist");
  });

  it("can't go to protected page if user is not logged", () => {
    cy.visit("/audio-player");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/");
    });
  });

  it("can't login without an email value", () => {
    cy.visit("/");
    cy.contains("button", "Sign in").click();
    cy.contains("p", "This field is required.");
  });

  it("can't login with an invalid email", () => {
    cy.visit("/");
    cy.get("input#email").type("test invalid email");
    cy.contains("button", "Sign in").click();
    cy.contains("p", "Invalid email address.");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/");
    });
  });

  it("can't login without a password value", () => {
    cy.visit("/");
    cy.get("input#email").type("test@example.com");
    cy.contains("button", "Sign in").click();
    cy.contains("p", "This field is required");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/");
    });
  });

  it("can't login with invalid credentials", () => {
    cy.intercept("/api/user/login", {
      statusCode: 404,
      body: {},
    });

    cy.visit("/");

    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("invalid-password");
    cy.contains("button", "Sign in").click();
    cy.contains("p", "Invalid email or password");
  });

  it("can login with valid credentials", () => {
    cy.intercept("/api/user/login", {
      statusCode: 200,
      fixture: "login.json",
    });

    cy.visit("/");

    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("invalid-password");
    cy.contains("button", "Sign in").click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/audio-player");
    });
  });
});
