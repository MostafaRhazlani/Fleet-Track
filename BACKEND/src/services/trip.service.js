class TripService {
    constructor(tripRepository) {
        this.tripRepository = tripRepository;
    }

    async createTrip(data) {
        return this.tripRepository.create(data);
    }

    async getAllTrips() {
        return this.tripRepository.findAll();
    }

    async getTripsByDriver(driverId) {
        return this.tripRepository.findByDriver(driverId);
    }

    async getTripById(id) {
        return this.tripRepository.findById(id);
    }

    async updateTrip(id, data) {
        return this.tripRepository.update(id, data);
    }

    async deleteTrip(id) {
        return this.tripRepository.delete(id);
    }

    async generateTripPdf(trip) {
        const PDFDocument = (await import("pdfkit")).default;
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        const primaryColor = "#EC6822";
        const secondaryColor = "#1F2937";
        const lineColor = "#E5E7EB";

        doc.rect(0, 0, 595.28, 140).fill(primaryColor);

        doc
            .fillColor("#FFFFFF")
            .fontSize(26)
            .font("Helvetica-Bold")
            .text("TRIP REPORT", 50, 45);

        doc
            .fontSize(12)
            .font("Helvetica")
            .text("Fleet Track Management System", 50, 80);

        const today = new Date().toLocaleDateString();
        doc
            .fontSize(10)
            .text(`Generated: ${today}`, 50, 100, { align: "right", width: 495 });

        let y = 180;
        const xLabel = 50;
        const xValue = 200;

        const drawRow = (label, value) => {
            doc
                .strokeColor(lineColor)
                .lineWidth(1)
                .moveTo(50, y - 10)
                .lineTo(545, y - 10)
                .stroke();

            doc
                .fillColor(secondaryColor)
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(label, xLabel, y);

            doc
                .font("Helvetica")
                .text(value || "—", xValue, y, { width: 340, align: "left" });

            y += 40;
        };

        doc.fillColor("black");

        const driverName = trip.driver
            ? trip.driver.first_name
                ? `${trip.driver.first_name} ${trip.driver.last_name}`
                : "Unknown Driver"
            : "No Driver Assigned";

        const formatDate = (date) => (date ? new Date(date).toLocaleString() : "—");

        drawRow("Trip ID:", trip._id.toString().substring(0, 8).toUpperCase());
        drawRow("From:", trip.from);
        drawRow("To:", trip.to);
        drawRow("Status:", trip.status.toUpperCase());
        drawRow("Driver:", driverName);
        drawRow("Start Date:", formatDate(trip.startDate));
        drawRow("End Date:", formatDate(trip.endDate));

        if (trip.notes) {
            y += 10;
            doc.font("Helvetica-Bold").text("Notes:", xLabel, y);
            y += 20;

            doc.rect(50, y, 495, 60).fill("#F3F4F6");
            doc
                .fillColor(secondaryColor)
                .font("Helvetica")
                .fontSize(11)
                .text(trip.notes, 60, y + 15, { width: 475 });
        }

        doc
            .fontSize(10)
            .fillColor("#9CA3AF")
            .text("Fleet Truck", 50, 750, {
                align: "center",
                width: 500,
            });

        return await new Promise((resolve, reject) => {
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            doc.end();
        });
    }
}

export default TripService;
