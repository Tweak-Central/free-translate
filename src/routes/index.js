export default function createRoutes(app) {
    app.get("/", (req, res) => {
        res.status(200).json({
            status: "online",
        });
    });
}
