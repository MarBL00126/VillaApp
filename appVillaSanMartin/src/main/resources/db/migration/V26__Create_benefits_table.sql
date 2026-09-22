CREATE TABLE benefits (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    type          VARCHAR(50) NOT NULL,
    -- SHOP_DISCOUNT | CANTINA_DISCOUNT | PRESALE | EXCLUSIVE_CONTENT
    discount_pct  NUMERIC(5,2),
    active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE benefit_membership_types (
    benefit_id          INT NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
    membership_type_id  INT NOT NULL REFERENCES membership_types(id) ON DELETE CASCADE,
    PRIMARY KEY (benefit_id, membership_type_id)
);