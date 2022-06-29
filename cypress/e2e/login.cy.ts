describe("login view specs", () => {
  it("can't login if fields are empty", () => {
    cy.visit("/");
    cy.get("button").contains("Login").click();
    cy.get("form").should("exist");
  });

  it("can't go to protected page if user is not logged", () => {
    cy.visit("/audio-player");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/");
    });
  });

  it("can't login without invalid email", () => {
    cy.visit("/");
    cy.get("input#email").type("test");
    cy.get("button").click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/");
    });
  });

  it("can't login without password", () => {
    cy.visit("/");
    cy.get("input#email").type("test@example.com");
    cy.get("button").click();
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
    cy.get("button").click();
    cy.get("p").contains("Invalid email or password").should("be.visible");
  });

  it("can login with valid credentials", () => {
    cy.intercept("/api/user/login", {
      statusCode: 200,
      fixture: "login.json",
    });

    cy.visit("/");

    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("invalid-password");
    cy.get("button").click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/audio-player");
    });
  });
});
