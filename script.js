
let currentTimeFrame = "weekly";
let globalData = [];

const updateDashboards = (timeframe) => {
  highlightTimeFrame(timeframe);
  updatePage(timeframe);
};

const updateData = () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      globalData = data;
    });
};

const distillData = (timeframe) => {
  let newDashboardDataPoint = {};
  let newDashboardArray = [];
  let data = globalData;
  data.forEach((dataStream) => {
    newDashboardDataPoint.title = dataStream.title;
    newDashboardDataPoint.timeslot = dataStream.timeframes[timeframe];
    newDashboardArray.push(newDashboardDataPoint);
    newDashboardDataPoint = {};
  });

  return newDashboardArray;
};

const updatePage = (timeframe) => {
  const message = {
    daily: "Yesterday",
    weekly: "Last Week",
    monthly: "Last Month",
  };

  let data = distillData(timeframe);

  data.forEach((category) => {
    // Use a regular expression to remove any empty space
    document.getElementById(
      `${category.title.toLowerCase().replace(/ +/g, "")}-current`
    ).innerHTML = `${category.timeslot["current"]}hrs`;
    document.getElementById(
      `${category.title.toLowerCase().replace(/ +/g, "")}-previous`
    ).innerHTML = `${message[timeframe]} - ${category.timeslot["previous"]}hrs`;
    return;
  });
};

const timeframes = document.getElementsByClassName("time__button-style");

// function that highlight the current time frame button
const highlightTimeFrame = (timeframe) => {
  Array.from(timeframes).forEach(function (format) {
    if (format.innerHTML.toLowerCase() === timeframe) {
      format.classList.add("time--highlight");
    } else {
      format.classList.remove("time--highlight");
    }
  });
};

const initilizePage = () => {
  updateData();
  updatePage(currentTimeFrame);

  // Initialize the timeframe buttons upon page load to ability to update dashboard's data
  Array.from(timeframes).forEach(function (button) {
    button.addEventListener("click", function () {
      updateDashboards(button.innerHTML.toLowerCase());
    });
  });
};

initilizePage();

