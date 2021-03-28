const db = require("./connectDb.ts");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const url = "http://localhost:3001/api";
const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MDM3OTZjNGVmOGI4MjE2MTBmNGJhMGYiLCJlbWFpbCI6InRoZS5yZWFsLmVsLmhvbnJhZG9AZ21haWwuY29tIiwiaWF0IjoxNjE0MjU1ODEyLCJleHAiOjE2MTYwNTU4MTJ9.fRZ64SEBtFL84l0kxFloK32loe_84o-Lme5ZAIo9ZKU`;
// db();
const categories = [
    {
        name: "Accommodation",
        categoryType: "Service",
    },
    {
        name: "Phones, Tablets & Accessories",
        categoryType: "Product",
    },
    {
        name: "Books",
        categoryType: "Product",
    },
    {
        name: "Fashion",
        categoryType: "Product",
    },
    {
        name: "Electronics",
        categoryType: "Product",
    },
    {
        name: "Health & Beauty",
        categoryType: "Product",
    },
    {
        name: "Events & Parties",
        categoryType: "Service",
    },
    {
        name: "Scholarships",
        categoryType: "Service",
    },
    {
        name: "Tutorials & Training",
        categoryType: "Service",
    },
    {
        name: "Restaurant & Food Services",
        categoryType: "Service",
    },
    {
        name: "Services",
        categoryType: "Service",
    },
    {
        name: "Part Time jobs",
        categoryType: "Service",
    },
    {
        name: "Art, Board Games & Sports Equipment",
        categoryType: "Product",
    },
];
const DO = (array) => {
    array.forEach((category) => {
        axios
            .post("{url}/categories", category, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((data) => console.log(data.data))
            .catch((err) => console.log(err));
    });
};
const GET = () => {
    axios
        .get("http://localhost:3001/categories")
        .then((data) => console.log(data.data))
        .catch((err) => console.log(err));
};
DO(categories);
// GET();
// process.exit(0);
//# sourceMappingURL=populateCategory.js.map