import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import moviesReducer from "./redux/slices/movieSlice";
import { POSTER_BASE_URL } from "./utils/constants";

const mockMovies = [
  {
    id: 1241982,
    title: "Moana 2",
    vote_average: 7.1,
    release_date: "2024-11-27",
    poster_path: "/4YZpsylmjHbqeWzjKpUEF8gcLNW.jpg",
  },
  {
    id: 912649,
    title: "Venom: The Last Dance",
    vote_average: 6.42,
    release_date: "2024-10-22",
    poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
  },
];

const store = configureStore({
  reducer: {
    movies: moviesReducer,
  },
  preloadedState: {
    movies: {
      data: mockMovies,
      error: null,
      isLoading: false,
      hasMoreData: true,
    },
  },
});

// Mock IntersectionObserver globally
beforeAll(() => {
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
      this.elements = [];
    }
    observe(element) {
      this.elements.push(element);
      this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve(element) {
      this.elements = this.elements.filter((el) => el !== element);
    }
  }

  global.IntersectionObserver = MockIntersectionObserver;
});

describe("App Component", () => {
  test("Renders movies correctly", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Check if movies are rendered
    mockMovies.forEach((movie) => {
      expect(screen.getByText(movie.title)).toBeInTheDocument();
      expect(
        screen.getByText(
          `Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : "-"}`
        )
      ).toBeInTheDocument();
    });

    // Check if images are rendered
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(mockMovies.length);
    expect(images[0]).toHaveAttribute(
      "src",
      `${POSTER_BASE_URL}${mockMovies[0].poster_path}`
    );
  });

  test("Displays loading text when loading", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByTestId("loadingMore")).toBeInTheDocument();
  });

  test("Displays error message when an error occurred", () => {
    const errorState = {
      movies: {
        data: [],
        error: "Failed to fetch movies.",
        isLoading: false,
        hasMoreData: true,
      },
    };

    const errorStore = configureStore({
      reducer: {
        movies: moviesReducer,
      },
      preloadedState: errorState,
    });

    render(
      <Provider store={errorStore}>
        <App />
      </Provider>
    );

    // Check if the error message is displayed
    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Failed to fetch movies.");
  });
});
