# SortedProcessor: Processor Comparison Website

[![GitHub license](https://img.shields.io/github/license/visnkmr/sortedproc)](https://github.com/visnkmr/sortedproc/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/visnkmr/sortedproc)](https://github.com/visnkmr/sortedproc/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/visnkmr/sortedproc)](https://github.com/visnkmr/sortedproc/network/members)


**SortedProcessors** is a web application built with **Next.js** (React) and **TypeScript** that allows users to explore, filter, sort, and compare various **processor models** based on their specifications and technical characteristics. It's designed to help users make informed decisions when considering a new processor.

---

## 🚀 Features

- ### 🧠 **Extensive Processor Database**
  Includes a wide range of processor models from manufacturers like **Intel**, **AMD**, **Apple**, **Qualcomm**, **MediaTek**, **Samsung**, **IBM**, and more.

- ### 🎛️ **Specification Filtering**
  Filter processors using interactive sliders and selectors based on:
  - `p_cores`
  - `e_cores`
  - `total_threads`
  - `base_power_tdp_w`
  - `max_turbo_power_w`
  - `p_core_base_clock_ghz`
  - `p_core_boost_clock_ghz`
  - `e_core_base_clock_ghz`
  - `e_core_boost_clock_ghz`
  - `l2_cache_mb`
  - `l3_cache_mb`
  - `initial_price_usd_approx`
  - And more...

- ### 🔍 **Search Functionality**
  Quickly find processors by **model name**.

- ### 🏷️ **Manufacturer Filtering**
  Filter processors by **manufacturer**.

- ### ↕️ **Sorting**
  Sort processors by:
  - Model
  - Release Year
  - Price
  - Cores/Threads
  - Power (TDP)
  - Clock Speeds
  - Cache Sizes
  - Manufacturing Node
  - Socket Type
  - **Custom Calculated Metrics**

- ### 📌 **Pinning**
  Pin a processor to compare it side-by-side with others using **percentage-based differences** in key metrics.

- ### ⭐ **Starring**
  Mark your **favorite processors** and access them quickly from a starred list.

- ### 🔄 **Comparison Filters**
  Apply **conditional comparisons** (e.g., greater than/less than) relative to the pinned processor.

- ### 📊 **Dynamic Range Sliders**
  Slider ranges adjust based on **min/max values** from all processors for each metric.

- ### 📱 **Responsive Design**
  Fully responsive UI optimized for **desktops, tablets, and mobile devices**.

- ### 👁️‍🗨️ **Toggle Filter Visibility**
  Easily **show or hide filters** for a clean and focused user interface.

- ### ⚡ **Performance**
  Optimized for **fast load times** and **smooth interactivity** with large datasets.

---

## Tech Stack

-   **Next.js:** A React framework for building user interfaces.
-   **TypeScript:** A statically-typed superset of JavaScript for enhanced code quality and maintainability.
-   **React:** A JavaScript library for building user interfaces.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **Lucide-react:** for icons.
- **shadcn/ui:** A Component library.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/visnkmr/sortedproc.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd procproj
    ```

3.  Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your web browser and visit `http://localhost:3000` to view the application.

### Build and Production
To build the application for production

```bash
npm run build
# or
yarn build
```

To start the application in production mode:

```bash
npm start
#or
yarn start
```

### Project Structure
- src/app/page.tsx: Main page component for the application.
- src/app/models.tsx: Contains the data for all Processor models.
- src/components/ui/: Components that come from shadcn/ui
- other usual nextjs folders.

### Contributing
Contributions are welcome! If you want to contribute to this project, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them with descriptive messages.
- Push your branch to your forked repository.
- Submit a pull request to the main branch of the original repository.

### Adding New Processor Models
To add new Processor models, follow these steps:

- Open the src/app/models.tsx file.
- Add the new Processor model data as a new object in the corresponding model series array (e.g., intel13,intel14,etc.).
- Ensure that the new Processor data conforms to the ProcessorData type definition in src/app/page.tsx.
- If a new model series is added, Add the exported model series to page.tsx file.
- Submit a pull request.

### License
This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE.

### Contact
If you have any questions or suggestions, feel free to contact me through GitHub. https://github.com/visnkmr/sortedproc

### Acknowledgements
shadcn/ui  
Lucide  
v0  


Created with ❤️ by visnkmr