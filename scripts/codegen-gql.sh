./node_modules/.bin/apollo client:codegen --endpoint='https://api.subquery.network/sq/subquery/kepler-subquery-project-mumbai' --target=typescript --tagName=gql --useReadOnlyTypes --passthroughCustomScalars --customScalarsPrefix=GraphQL_ --outputFlat src/__generated__
./node_modules/.bin/apollo client:codegen --endpoint='http://localhost:8000/graphql' --target=typescript --tagName=gql --useReadOnlyTypes --passthroughCustomScalars --customScalarsPrefix=GraphQL_ --outputFlat src/__generated__#