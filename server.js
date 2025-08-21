const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const basicAuth = require("express-basic-auth");
const createError = require("http-errors");
const db = require("./src/models");

dotenv.config();

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5002"],
    methods: ["GET", "POST"],
};

app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(function (req, res, next) {
    const messages = req.session.messages || [];
    res.locals.messages = messages;
    res.locals.hasMessages = !!messages.length;
    const errors = req.session.errors || [];
    res.locals.errors = errors;
    res.locals.hasErrors = !!errors.length;
    req.session.errors = [];
    req.session.messages = [];
    next();
});

const port = process.env.PORT || 5000;

const History = db.history.History;
const validateHistory = db.history.validate;
const Settings = db.settings.Settings;
const validateSettings = db.settings.validate;

const mongo_url = process.env.MONGODB_URL;
db.mongoose
    .connect(mongo_url)
    .then(() => {
        console.log(`Database Connected Successfully`);
    })
    .catch((error) => {
        console.error("Database Connection Error", error);
        process.exit();
    });

const baseAuthPassword = process.env.ADMIN_PWD;

const basicAuthMiddleware = basicAuth({
    users: {
        admin: baseAuthPassword,
    },
    challenge: true,
});

app.post("/history", async (req, res) => {
    const data = {
        result: req.body.result,
        odds: req.body.odds,
        bonus_result: req.body.bonus_result,
    };

    const result = validateHistory(data);
    if (result.error) {
        return res
            .status(422)
            .send({ result: "error", message: result.error.message });
    } else {
        await History.create(result.value);

        const count = await History.countDocuments();
        if (count > 80) {
            const oldest = await History.find({})
                .sort({ date_time: 1 }) // oldest first
                .limit(count - 80); // how many to delete to keep max 80

            const oldestIds = oldest.map((item) => item._id);
            await History.deleteMany({ _id: { $in: oldestIds } });
        }

        return res.status(200).send({
            result: "success",
            message: "History saved successfully!",
        });
    }
});

app.get("/admin", basicAuthMiddleware, async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const history = await History.find({}, { sort: { date_time: -1 } })
        .skip(skip)
        .limit(limit);
    return res.render("admin/index", { history, skip, limit });
});

app.get("/admin/history", basicAuthMiddleware, async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    // const history = await History.find({}, { sort: { date_time: -1 } })
    //     .skip(skip)
    //     .limit(limit);
    const history = await History.find({})
        .sort({ date_time: -1 })
        .skip(skip)
        .limit(limit);

    return res.render("admin/history", { history, skip, limit });
});

app.post("/admin/settings", basicAuthMiddleware, async (req, res) => {
    console.log(req.body);
    const data = {
        segment_1: parseInt(req.body.segment_1),
        segment_2: parseInt(req.body.segment_2),
        segment_3: parseInt(req.body.segment_3),
        segment_4: parseInt(req.body.segment_4),
        segment_5: parseInt(req.body.segment_5),
        segment_6: parseInt(req.body.segment_6),
        segment_7: parseInt(req.body.segment_7),
        segment_8: parseInt(req.body.segment_8),
        segment_9: parseInt(req.body.segment_9),
        segment_10: parseInt(req.body.segment_10),
        segment_11: parseInt(req.body.segment_11),
        segment_12: parseInt(req.body.segment_12),
        eye_bonus_no: parseInt(req.body.eye_bonus_no),
        eye_bonus_half: parseInt(req.body.eye_bonus_half),
        eye_bonus_full: parseInt(req.body.eye_bonus_full),
    };

    const result = validateSettings(data);
    if (result.error) {
        req.session.errors = [result.error.message];
        return res.redirect("/admin/settings");
    }

    const {
        segment_1,
        segment_2,
        segment_3,
        segment_4,
        segment_5,
        segment_6,
        segment_7,
        segment_8,
        segment_9,
        segment_10,
        segment_11,
        segment_12,
        eye_bonus_no,
        eye_bonus_half,
        eye_bonus_full,
    } = result.value;
    const segment_total =
        segment_1 +
        segment_2 +
        segment_3 +
        segment_4 +
        segment_5 +
        segment_6 +
        segment_7 +
        segment_8 +
        segment_9 +
        segment_10 +
        segment_11 +
        segment_12;
    const eye_bonus_total = eye_bonus_no + eye_bonus_half + eye_bonus_full;

    if (segment_total !== 100 || eye_bonus_total !== 100) {
        req.session.errors = ["Invalid percentage value!"];
        return res.redirect("/admin/settings");
    }

    const settings = await Settings.findOne({});
    if (settings) {
        await Settings.updateOne({ _id: settings._id }, result.value);
    } else {
        await Settings.create(result.value);
    }
    req.session.messages = ["Settings update success!"];
    return res.redirect("/admin/settings");
});

app.get("/admin/settings", basicAuthMiddleware, async (req, res) => {
    const settings = await Settings.findOne({});
    return res.render("admin/settings", { settings });
});

app.get(/.*/, async (req, res) => {
    const settings = await Settings.findOne({});
    const data = settings
        ? { settings: JSON.stringify(settings.toJSON()) }
        : { settings: null };
    return res.render("index", data);
});

app.use(function (req, res, next) {
    next(createError(404));
});

// app.get("/api/settings", async (req, res) => {
//     try {
//         const settings = await Settings.findOne({});
//         if (!settings) {
//             return res.status(404).json({ error: "Settings not found" });
//         }
//         res.json(settings);
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// });

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.status = err.status || 500;
    res.status(err.status || 500);
    res.render("error", { title: err.message });
});

app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});
