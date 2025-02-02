package cx.flamingo.analysis.graphql;

import java.util.ArrayList;
import java.util.List;

public class GitHubQueryBuilder {

    private final SearchField searchField;

    public GitHubQueryBuilder() {
        this.searchField = new SearchField();
    }

    public GitHubQueryBuilder searchUsers(int size) {
        searchField.setType("USER", size)
                  .addSort("repositories", "desc")
                  .addSort("stars", "desc")
                  .addSort("followers", "desc");
        return this;
    }

    public GitHubQueryBuilder location(String location) {
        searchField.addLocationFilter(location);
        return this;
    }

    public GitHubQueryBuilder language(String language) {
        searchField.addLanguageFilter(language);
        return this;
    }

    public GitHubQueryBuilder cursor(String cursor) {
        if (cursor != null) {
            searchField.withArgs(searchField.getArgs() + ", after: \"" + cursor + "\"");
        }
        return this;
    }

    public SearchField getSearchField() {
        return searchField;
    }

    public String build() {
        return "query { " + searchField.build() + " }";
    }

    public static class Field {

        private final String name;
        private final List<Field> subfields = new ArrayList<>();
        private String alias;
        protected String args;

        public Field(String name) {
            this.name = name;
        }

        public Field withAlias(String alias) {
            this.alias = alias;
            return this;
        }

        public Field withArgs(String args) {
            this.args = args;
            return this;
        }

        public Field addField(String name) {
            Field field = new Field(name);
            subfields.add(field);
            return field;
        }

        public Field addArg(String name, Object value) {
            String currentArgs = this.args != null ? this.args + ", " : "";
            this.withArgs(currentArgs + name + ": " + value);
            return this;
        }

        public String build() {
            StringBuilder sb = new StringBuilder();
            if (alias != null) {
                sb.append(alias).append(": ");
            }
            sb.append(name);
            if (args != null) {
                sb.append("(").append(args).append(")");
            }
            if (!subfields.isEmpty()) {
                sb.append(" { ");
                for (Field field : subfields) {
                    sb.append(field.build()).append(" ");
                }
                sb.append("}");
            }
            return sb.toString();
        }
    }

    public static class SearchField extends Field {

        private final StringBuilder queryFilters = new StringBuilder();

        public SearchField() {
            super("search");
            setupDefaultFields();
        }

        public String getArgs() {
            return this.args;
        }

        private void setupDefaultFields() {
            addField("userCount");
            
            Field pageInfo = addField("pageInfo");
            pageInfo.addField("hasNextPage");
            pageInfo.addField("endCursor");

            Field nodes = addField("nodes");
            Field user = nodes.addField("... on User");
            user.addField("login");
            user.addField("name");
            user.addField("location");
            user.addField("url");
            user.addField("email");
            user.addField("websiteUrl");
            user.addField("avatarUrl");
            user.addField("twitterUsername");

            // Add social accounts
            Field socialAccounts = user.addField("socialAccounts");
            socialAccounts.withArgs("first: 10");
            Field socialNodes = socialAccounts.addField("nodes");
            socialNodes.addField("provider");
            socialNodes.addField("url");

            Field contributions = user.addField("contributionsCollection");
            contributions.addField("totalCommitContributions");
            contributions.addField("restrictedContributionsCount");
            
            Field calendar = contributions.addField("contributionCalendar");
            calendar.addField("totalContributions");
            Field weeks = calendar.addField("weeks");
            Field contributionDays = weeks.addField("contributionDays");
            contributionDays.addField("date");
            contributionDays.addField("contributionCount");

            // Starred repositories
            Field starred = user.addField("starredRepositories");
            starred.withArgs("first: 15")
                  .addField("totalCount");

            // Forked repositories
            Field forkedRepos = user.addField("repositories");
            forkedRepos.withAlias("forkedRepos")
                      .withArgs("first: 1, isFork: true")
                      .addField("totalCount");

            // Original repositories
            Field originalRepos = user.addField("repositories");
            originalRepos.withAlias("originalRepos")
                        .withArgs("first: 15, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}");
            
            Field repoNodes = originalRepos.addField("nodes");
            repoNodes.addField("name");
            repoNodes.addField("stargazerCount");
            repoNodes.addField("forkCount");
            
            Field lang = repoNodes.addField("primaryLanguage");
            lang.addField("name");
        }

        public SearchField setType(String type, int size) {
            this.withArgs("type: " + type + ", first: " + size);
            return this;
        }

        public SearchField setFirst(int first) {
            return this;
        }

        public SearchField addLocationFilter(String location) {
            if (queryFilters.length() > 0) queryFilters.append(" ");
            queryFilters.append("location:").append("\\\"").append(location).append("\\\"");
            updateQueryArg();
            return this;
        }

        public SearchField addLanguageFilter(String language) {
            if (queryFilters.length() > 0) queryFilters.append(" ");
            queryFilters.append("language:").append(language);
            updateQueryArg();
            return this;
        }

        public SearchField addSort(String field, String direction) {
            if (queryFilters.length() > 0) queryFilters.append(" ");
            queryFilters.append("sort:").append(field).append("-").append(direction);
            updateQueryArg();
            return this;
        }

        private void updateQueryArg() {
            String currentArgs = this.args != null ? this.args.replaceAll(", query: .*$", "") : "";
            this.withArgs(currentArgs + ", query: \"" + queryFilters.toString() + "\"");
        }
    }
}
