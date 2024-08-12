package com.legendatours.beans;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractMetaBean {
    private final Map<String, Object> meta;

    public AbstractMetaBean() {
        meta = new HashMap<>();
    }

    public Map<String, Object> getMeta() {
        return meta;
    }
}
