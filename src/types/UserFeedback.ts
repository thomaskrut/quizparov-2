export interface UserFeedback {
    message: string,
    icon: "mdi-information" | "mdi-alert" | "mdi-check" | "mdi-star-face" | "mdi-head-question",
    color: "primary" | "error" | "success" | "info",
    buttonText: "OK" | "Välj drag" | "Fortsätt"
}