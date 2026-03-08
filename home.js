const labelColors = {
  "bug": "bg-red-100 text-red-700 border-red-200",
  "help wanted": "bg-[#DEFCE8] text-[#00A96E] border-[#BBF7D0]",
  "feature": "bg-green-100 text-green-700 border-green-200",
  "enhancement": "bg-[#DEFCE8] text-[#00A96E] border-[#BBF7D0]",
  "good first issue": "bg-[#DEFCE8] text-[#00A96E] border-[#BBF7D0]",
  "documentation": "bg-[#DEFCE8] text-[#00A96E] border-[#BBF7D0]",
  
}

let allIssues = []; 

// Display issues + length count
const displayIssues = (issues) => {
  const container = document.getElementById("issuesContainer");
  container.innerHTML = "";

  // Show total count
  document.getElementById("issueLength").innerText = ` ${issues.length}`;

  issues.forEach(issue => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition mb-3";

    // Border status color
    if(issue.status === "open"){
      card.classList.add("border-t-4","border-green-500");
    } else {
      card.classList.add("border-t-4","border-purple-500");
    }

    // Capitalize priority for ternary
    const priority = issue.priority.toLowerCase(); // ensures "high", "medium", "low"

    // Card content
    card.innerHTML = `
     <div class="flex justify-between items-center mb-2">
    <img src="assets/${issue.status === 'open' ? 'Open-Status.png' : 'Closed .png'}" alt="">
    <button class="w-20 h-6 rounded-[100px] text-[12px] font-semibold ${
      priority === "high" ? "bg-[#FEECEC] text-[#EF4444]" :
      priority === "medium" ? "bg-[#FFF6D1] text-[#F59E0B]" :
      "bg-[#EEEFF2] text-[#9CA3AF]"
    }">
      ${issue.priority}
    </button>
  </div>
  <h3 class="titel-text font-semibold text-gray-800 mb-2">${issue.title}</h3>
  <p class="pere-text text-[12px]">${issue.description}</p>
  <div class="flex gap-2 mb-3">
    ${(issue.labels || []).map(label => {
      const colorClass = labelColors[label] || "bg-gray-100 text-gray-700 border-gray-200";
      return `<span class="text-xs border px-2 py-1 rounded-2xl ${colorClass}">${label}</span>`;
    }).join('')}
  </div>
  <p class="pere-text text-[12px]">#${issue.id} by ${issue.author}</p>
  <p class="pere-text text-[12px]">${issue.createdAt}</p>
    `;
    card.addEventListener('click', () => openModal(issue));
    container.appendChild(card);
  });
};

// Tab highlight + filtered display
function setActiveTab(tabId) {
  document.querySelectorAll(".btntab").forEach(tab => tab.classList.remove("bg-blue-700", "text-white"));
  const tab = document.getElementById(tabId);
  tab.classList.add("bg-blue-700", "text-white");

  let filteredIssues;
  if(tabId === "allTab") filteredIssues = allIssues;
  else if(tabId === "openTab") filteredIssues = allIssues.filter(issue => issue.status === "open");
  else filteredIssues = allIssues.filter(issue => issue.status === "closed");

  displayIssues(filteredIssues);
}

// Load issues from API
const loadIssues = async () => {
  const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await response.json();
  allIssues = data.data;
  setActiveTab("allTab"); // default
};

// Open modal
const openModal = (issue) => {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");

  // Map fields dynamically
  const fields = {
    "h2": issue.title,
    ".modal-desc": issue.description,
    ".modal-priority": issue.priority,
    ".assignee": issue.author,
    ".createdAt": issue.createdAt,
    ".status-span": issue.status
  };

  for (let selector in fields) {
    const el = modal.querySelector(selector);
    if (!el) continue;

    if (selector === ".status-span") {
      el.innerText = fields[selector];
      el.className = `status-span text-xs px-2 py-1 rounded-full ${issue.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`;
    } else {
      el.innerText = fields[selector];
    }
  }

  // Labels
  modal.querySelector(".tags-container").innerHTML = (issue.labels || [])
    .map(label => `<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">${label}</span>`)
    .join('');
};

// Close modal
document.querySelector('#modal .close-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allIssues.filter(issue =>
    issue.title.toLowerCase().includes(query) ||
    issue.description.toLowerCase().includes(query)
  );
  displayIssues(filtered);
});

// Initialize
loadIssues();