package cx.flamingo.analysis.cache.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Expiration {
    private long timestamp;
}
