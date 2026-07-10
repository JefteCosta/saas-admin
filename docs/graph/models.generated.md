# Models — Diagrama ER

> Arquivo gerado automaticamente por `node ace graph:generate`. Não edite manualmente.

## Diagrama

```mermaid
erDiagram
  auth_tokens {
    number id
    string token
    number userId
    string redirectUrl
    DateTime expiresAt
    DateTime usedAt
    DateTime createdAt
  }
  companies {
    number id
    string slug
    string name
    string legalName
    string document
    string stateRegistration
    string phone
    string logoUrl
    number planId
    number ownerUserId
    boolean isActive
    DateTime createdAt
    DateTime updatedAt
  }
  company_addresses {
    number id
    number companyId
    string label
    string street
    string number
    string complement
    string neighborhood
    string city
    string state
    string zipCode
    string country
    boolean isPrimary
    DateTime createdAt
    DateTime updatedAt
  }
  features {
    number id
    number moduleId
    number featureGroupId
    string slug
    string name
    string description
    string icon
    string route
    number position
    boolean isMenuItem
    boolean isActive
    DateTime createdAt
    DateTime updatedAt
  }
  feature_groups {
    number id
    number moduleId
    string slug
    string name
    string icon
    number position
    boolean isActive
    DateTime createdAt
    DateTime updatedAt
  }
  modules {
    number id
    string slug
    string name
    string icon
    number position
    boolean isActive
    DateTime createdAt
    DateTime updatedAt
  }
  plans {
    number id
    string slug
    string name
    string description
    number price
    boolean isActive
    DateTime createdAt
    DateTime updatedAt
  }
  roles {
    number id
    string slug
    string name
    string description
    boolean isDefault
    number companyId
    DateTime createdAt
    DateTime updatedAt
  }
  teams {
    number id
    string name
    string slug
    number roleId
    number companyId
    DateTime createdAt
    DateTime updatedAt
  }
  users {
    number id
    string fullName
    string email
    string password
    number roleId
    DateTime createdAt
    DateTime updatedAt
  }
  auth_tokens }o--|| users : "belongsTo"
  companies }o--|| plans : "belongsTo"
  companies ||--o{ company_addresses : "hasMany"
  companies ||--o{ teams : "hasMany"
  companies ||--o{ roles : "hasMany"
  company_addresses }o--|| companies : "belongsTo"
  features }o--|| modules : "belongsTo"
  features }o--|| feature_groups : "belongsTo"
  feature_groups }o--|| modules : "belongsTo"
  feature_groups ||--o{ features : "hasMany"
  modules ||--o{ feature_groups : "hasMany"
  modules ||--o{ features : "hasMany"
  roles }o--|| companies : "belongsTo"
  teams }o--|| companies : "belongsTo"
  teams }o--|| roles : "belongsTo"
  users }o--|| roles : "belongsTo"
```

## Tabela de Models

| Model | Tabela | Colunas | Relações |
| --- | --- | --- | --- |
| AuthToken | auth_tokens | id, token, userId, redirectUrl, expiresAt, usedAt, createdAt | belongsTo → User |
| Company | companies | id, slug, name, legalName, document, stateRegistration, phone, logoUrl, planId, ownerUserId, isActive, createdAt, updatedAt | belongsTo → Plan, hasMany → CompanyAddress, hasMany → Team, hasMany → Role |
| CompanyAddress | company_addresses | id, companyId, label, street, number, complement, neighborhood, city, state, zipCode, country, isPrimary, createdAt, updatedAt | belongsTo → Company |
| Feature | features | id, moduleId, featureGroupId, slug, name, description, icon, route, position, isMenuItem, isActive, createdAt, updatedAt | belongsTo → Module, belongsTo → FeatureGroup |
| FeatureGroup | feature_groups | id, moduleId, slug, name, icon, position, isActive, createdAt, updatedAt | belongsTo → Module, hasMany → Feature |
| Module | modules | id, slug, name, icon, position, isActive, createdAt, updatedAt | hasMany → FeatureGroup, hasMany → Feature |
| Plan | plans | id, slug, name, description, price, isActive, createdAt, updatedAt |  |
| Role | roles | id, slug, name, description, isDefault, companyId, createdAt, updatedAt | belongsTo → Company |
| Team | teams | id, name, slug, roleId, companyId, createdAt, updatedAt | belongsTo → Company, belongsTo → Role |
| User | users | id, fullName, email, password, roleId, createdAt, updatedAt | belongsTo → Role |
