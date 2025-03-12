const School = require("../models/schoolModel");
const { haversineDistance } = require("../utils/geoUtils");

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required" });
  }

  School.addSchool(name, address, latitude, longitude, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const { latitude, longitude, radius = 10 } = req.query; // Default radius 10 km

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  School.getAllSchools((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const maxDistance = parseFloat(radius);

    const filteredSchools = results
      .map((school) => ({
        ...school,
        distance: haversineDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .filter((school) => school.distance <= maxDistance) // Only return schools within the radius
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(filteredSchools);
  });
};
