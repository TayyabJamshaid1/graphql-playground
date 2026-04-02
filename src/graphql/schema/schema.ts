export const schema=`#graphql
    
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        googleId: String
        role: String!
        avatar: String!
        verified: Boolean!
        createdAt: String!
        updatedAt: String!
        courses: [Course!]!  # Added courses field to User type
    }
type Course {
    _id: ID!
    title: String!
    description: String!
    instructor: User!  # Changed from String! to User!
    price: Int!
    ratingAverage: Int!
    ratingQuantity: Int!
    category: String!
    subCategory: String!
    createdAt: String!
    updatedAt: String!
}
type Resource{
  _id:ID,
  title:String,
  url:String,
}
type VideoUrl{
  _480p:String,
  _720p:String,
  _1080p:String,

}
    type Lecture {
        _id: ID!
        title: String!
        description: String!
        videoUrl: VideoUrl!
        resources: [Resource!]!
        courseId: ID
        duration: Int
        order: Int
        isFree: Boolean
        createdAt: String!
        updatedAt: String!
    }

  type Query {
    hello: String
    wow:String
    users:[User]
    courses:[Course]
    lectures:[Lecture]
    course(id: ID!): Course
  }
`