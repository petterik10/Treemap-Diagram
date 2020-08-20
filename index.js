// // Creating a Treemap Diagram from 95 Highest-Grossing Films.
// Using D3.js to visualize data with AJAX request and JSON API.
// Creating the project for freeCodeCamp Data Visualization Certification as a final project.

const width = 1200;
const height = 600;
const padding = 35;

const svg = d3.select("svg");
svg.attr("viewBox", `0 0 1400 850`);

const tooltip = d3
  .select("#tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("class", "tooltip")
  .attr("id", "tooltip");

const legendContainer = [
  { color: "#FFC300", movieType: "Action" },
  { color: "#FF5733", movieType: "Adventure" },
  { color: "#C70039", movieType: "Comedy" },
  { color: "#900C3F", movieType: "Drama" },
  { color: "#581845", movieType: "Animation" },
  { color: "#B5983F", movieType: "Family" },
  { color: "#3FB590", movieType: "Biography" },
];

const calculateGross = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

const setLegendContainer = () => {
  svg
    .append("text")
    .attr("x", width + 180 + padding)
    .attr("y", 160)
    .text("Category");

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("#legend")
    .data(legendContainer)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", width + 200 - 18 + padding)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", (elem) => {
      return elem.color;
    })
    .style("stroke", "black");

  legend
    .append("text")
    .attr("x", width + 230 - 18 + padding)
    .attr("y", 18)
    .text((d) => {
      return d.movieType;
    });
};

const drawTreeMap = (movies) => {
  const hierarchy = d3
    .hierarchy(movies, (node) => {
      return node.children;
    })
    .sum((node) => {
      return node.value;
    })
    .sort((node1, node2) => {
      return node2.value - node1.value;
    });

  const treemap = d3.treemap().size([1400, 755]);
  treemap(hierarchy);
  const cell = svg
    .selectAll("g")
    .data(hierarchy.leaves())
    .enter()
    .append("g")
    .attr("transform", (elem) => {
      return "translate(" + elem.x0 + "," + elem.y0 + ")";
    });

  const tile = cell
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (elem) => {
      const movieCategory = elem.data.category;
      switch (movieCategory) {
        case "Action":
          return "#FFC300";
        case "Adventure":
          return "#FF5733";
        case "Comedy":
          return "#C70039";
        case "Drama":
          return "#900C3F";
        case "Animation":
          return "#581845";
        case "Family":
          return "#B5983F";
        case "Biography":
          return "#3FB590";
      }
    })
    .attr("data-name", (elem) => {
      return elem.data.name;
    })
    .attr("data-category", (elem) => {
      return elem.data.category;
    })
    .attr("data-value", (elem) => {
      return elem.data.value;
    })
    .attr("width", (elem) => {
      return elem.x1 - elem.x0;
    })
    .attr("height", (elem) => {
      return elem.y1 - elem.y0;
    })
    .style("stroke", "black")
    .on("mouseover", (d, i) => {
      tooltip.style("visibility", "visible");
      tooltip
        .html(
          `${d.data.name} <br>
           Gross: $${calculateGross(d.data.value)}
         `
        )
        .style("top", event.pageY - 2 + "px")
        .style("left", event.pageX + 10 + "px")
        .attr("data-value", () => {
          return d.data.value;
        });
    })
    .on("mouseout", (d) => {
      tooltip.style("visibility", "hidden");
    });

  cell
    .append("text")
    .selectAll("tspan")
    .data((d) => {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => {
      return 13 + i * 10;
    })
    .text((d) => {
      return d;
    })
    .attr("font-size", 12)
    .attr("font-weight", "bold");

  setLegendContainer();
};

fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
)
  .then((response) => response.json())
  .then((res) => {
    drawTreeMap(res);
  });
