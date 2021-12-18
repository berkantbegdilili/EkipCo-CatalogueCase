db = db.getSiblingDB("CatalogueCase")
db.createUser(
    {
        user: "berkant",
        pwd: "ekipco",
        roles: [
            {
                role: "readWrite",
                db: "CatalogueCase"
            }
        ]
    }
);