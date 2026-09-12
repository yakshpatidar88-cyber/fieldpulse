package com.opsflow.dto.common;

import java.time.Instant;
import java.util.Map;

public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
    private Instant timestamp = Instant.now();

    public ErrorResponse() {}

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public Map<String, String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ErrorResponse res = new ErrorResponse();

        public Builder status(int s) { res.setStatus(s); return this; }
        public Builder error(String e) { res.setError(e); return this; }
        public Builder message(String m) { res.setMessage(m); return this; }
        public Builder path(String p) { res.setPath(p); return this; }
        public Builder validationErrors(Map<String, String> v) { res.setValidationErrors(v); return this; }
        public Builder timestamp(Instant t) { res.setTimestamp(t); return this; }
        public ErrorResponse build() { return res; }
    }
}
