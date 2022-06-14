import createStore from "zustand";

const useAuthStore = createStore(
    (set) => ({
        token: localStorage.getItem("token"),
        setToken: (token) => {
            set(() => ({
                token
            })),
            localStorage.setItem("token", token);
        }
    })
);

export default useAuthStore;