package cx.flamingo.analysis.graphql;

public class SearchField extends Field {

    private final StringBuilder queryBuilder = new StringBuilder();

    public SearchField(String name) {
        super(name);
    }

    public SearchField appendQuery(String queryPart) {
        if (queryBuilder.length() > 0) {
            queryBuilder.append(" ");
        }
        queryBuilder.append(queryPart);
        String escaped = queryBuilder.toString().replace("\\", "\\\\").replace("\"", "\\\"");
        args.put("query", "\"" + escaped + "\"");
        return this;
    }

    @Override
    public SearchField addArg(String key, Object value) {
        super.addArg(key, value);
        return this;
    }
}
