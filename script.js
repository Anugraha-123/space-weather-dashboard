/* =========================================
   SPACE WEATHER DASHBOARD
   NOAA LIVE DATA
========================================= */


/* =========================================
   GET Kp INDEX
========================================= */

async function getKpIndex() {

    try {

        const url =
            "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Kp API failed");
        }

        const data =
            await response.json();

        console.log("NOAA Kp Data:", data);

        if (
            Array.isArray(data) &&
            data.length > 0
        ) {

            const latest =
                data[data.length - 1];

            const kp =
                Number(latest.Kp);

            if (!isNaN(kp)) {

                document.getElementById(
                    "kp-value"
                ).textContent =
                    kp.toFixed(1);

                return kp;
            }
        }

        document.getElementById(
            "kp-value"
        ).textContent = "N/A";

        return null;

    } catch (error) {

        console.error("Kp error:", error);

        document.getElementById(
            "kp-value"
        ).textContent = "N/A";

        return null;
    }
}


/* =========================================
   GET SOLAR WIND
========================================= */

async function getSolarWind() {

    try {

        const url =
            "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Solar wind API failed");
        }

        const data =
            await response.json();

        console.log(
            "NOAA Solar Wind Data:",
            data
        );

        if (
            Array.isArray(data) &&
            data.length > 0
        ) {

            const latest =
                data[data.length - 1];

            const speed =
                Number(latest.proton_speed);

            if (!isNaN(speed)) {

                document.getElementById(
                    "solar-wind"
                ).textContent =
                    Math.round(speed);

                return speed;
            }
        }

        document.getElementById(
            "solar-wind"
        ).textContent = "N/A";

        return null;

    } catch (error) {

        console.error(
            "Solar wind error:",
            error
        );

        document.getElementById(
            "solar-wind"
        ).textContent = "N/A";

        return null;
    }
}


/* =========================================
   GET SOLAR FLARES
========================================= */

async function getSolarFlares() {

    try {

        const url =
            "https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Solar flare API failed");
        }

        const data =
            await response.json();

        console.log(
            "NOAA Solar Flare Data:",
            data
        );

        if (Array.isArray(data)) {

            const count =
                data.length;

            document.getElementById(
                "flare-count"
            ).textContent =
                count;

            return count;
        }

        document.getElementById(
            "flare-count"
        ).textContent = "0";

        return 0;

    } catch (error) {

        console.error(
            "Solar flare error:",
            error
        );

        document.getElementById(
            "flare-count"
        ).textContent = "N/A";

        return null;
    }
}


/* =========================================
   UPDATE SOLAR ACTIVITY
========================================= */

function updateSolarActivity(kp) {

    const activity =
        document.getElementById(
            "solar-activity"
        );

    if (!activity) {
        return;
    }

    if (
        kp !== null &&
        kp >= 5
    ) {

        activity.textContent =
            "High";

    } else if (
        kp !== null &&
        kp >= 4
    ) {

        activity.textContent =
            "Moderate";

    } else {

        activity.textContent =
            "Active";
    }
}


/* =========================================
   UPDATE ALERT
========================================= */

function updateAlert(kp) {

    const alertBox =
        document.getElementById(
            "alert-box"
        );

    const title =
        document.getElementById(
            "alert-title"
        );

    const message =
        document.getElementById(
            "alert-message"
        );

    if (
        !alertBox ||
        !title ||
        !message
    ) {
        return;
    }


    /* Strong geomagnetic storm */

    if (
        kp !== null &&
        kp >= 7
    ) {

        alertBox.style.background =
            "rgba(127,29,29,0.25)";

        title.textContent =
            "⚠ Strong geomagnetic storm";

        message.textContent =
            "High geomagnetic activity is currently detected.";

        return;
    }


    /* Geomagnetic storm */

    if (
        kp !== null &&
        kp >= 5
    ) {

        alertBox.style.background =
            "rgba(120,53,15,0.25)";

        title.textContent =
            "⚠ Elevated space-weather activity";

        message.textContent =
            "Moderate geomagnetic activity is currently detected.";

        return;
    }


    /* Normal */

    alertBox.style.background =
        "rgba(22,101,52,0.16)";

    title.textContent =
        "✓ Space weather conditions are normal";

    message.textContent =
        "No significant geomagnetic disturbance detected.";
}


/* =========================================
   UPDATE LAST UPDATED TIME
========================================= */

function updateTime() {

    const now =
        new Date();

    const time =
        now.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "medium"
            }
        );

    const element =
        document.getElementById(
            "last-updated"
        );

    if (element) {

        element.textContent =
            time;
    }
}


/* =========================================
   GET REAL HISTORICAL KP DATA
========================================= */

async function getHistoricalKp() {

    try {

        const url =
            "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Historical Kp API failed"
            );
        }

        const data =
            await response.json();

        console.log(
            "Historical NOAA Kp:",
            data
        );


        /*
            Keep the most recent
            10 Kp measurements.
        */

        if (
            Array.isArray(data) &&
            data.length > 0
        ) {

            return data
                .slice(-10)
                .map(item => {

                    return {
                        time: item.time_tag,
                        kp: Number(item.Kp)
                    };

                })
                .filter(item =>
                    !isNaN(item.kp)
                );
        }

        return [];

    } catch (error) {

        console.error(
            "Historical Kp error:",
            error
        );

        return [];
    }
}


/* =========================================
   CREATE REAL NOAA ACTIVITY CHART
========================================= */

async function createActivityChart() {

    const chart =
        document.getElementById(
            "activity-chart"
        );

    if (!chart) {
        return;
    }


    /* Show loading */

    chart.innerHTML =
        "<div style='padding:20px;text-align:center;'>Loading NOAA Kp history...</div>";


    /*
        Get real NOAA data
    */

    const history =
        await getHistoricalKp();


    /*
        Clear chart
    */

    chart.innerHTML = "";


    if (history.length === 0) {

        chart.innerHTML =
            "<div style='padding:20px;text-align:center;'>Kp history unavailable</div>";

        return;
    }


    /*
        Create bars
    */

    history.forEach(item => {

        const bar =
            document.createElement(
                "div"
            );

        bar.className =
            "chart-bar";


        /*
            Kp ranges from 0 to 9.

            Convert Kp to a visual
            bar height.
        */

        const height =
            Math.max(
                10,
                item.kp * 20
            );


        bar.style.height =
            height + "px";


        /*
            Tooltip

            Example:
            Kp: 2.0
            Time: 09:00
        */

        const date =
            new Date(item.time);


        const time =
            date.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        bar.title =
            "Kp: " +
            item.kp.toFixed(1) +
            " | " +
            time;


        chart.appendChild(
            bar
        );

    });
}


/* =========================================
   MAIN LOAD FUNCTION
========================================= */

async function loadSpaceWeatherData() {

    console.log(
        "Loading space weather data..."
    );


    /*
        Monitoring status
    */

    const monitoring =
        document.getElementById(
            "monitoring-status"
        );

    if (monitoring) {

        monitoring.textContent =
            "Updating";
    }


    try {

        /*
            Load live data
        */

        const results =
            await Promise.all([
                getKpIndex(),
                getSolarWind(),
                getSolarFlares()
            ]);


        const kp =
            results[0];


        /*
            Update dashboard
        */

        updateSolarActivity(
            kp
        );


        updateAlert(
            kp
        );


        updateTime();


        /*
            Load real NOAA history
        */

        await createActivityChart();


        /*
            Dashboard ready
        */

        if (monitoring) {

            monitoring.textContent =
                "Monitoring";
        }


        console.log(
            "Space weather data loaded successfully."
        );

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        if (monitoring) {

            monitoring.textContent =
                "Connection issue";
        }
    }
}


/* =========================================
   START DASHBOARD
========================================= */

loadSpaceWeatherData();


/* =========================================
   AUTOMATIC REFRESH
   Every 5 minutes
========================================= */

setInterval(
    loadSpaceWeatherData,
    5 * 60 * 1000
);