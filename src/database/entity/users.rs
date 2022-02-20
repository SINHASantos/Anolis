//! SeaORM Entity. Generated by sea-orm-codegen 0.6.0

use super::DB_SONYFLAKE;

use super::sea_orm_active_enums::Role;
use sea_orm::{entity::prelude::*, Set};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    #[sea_orm(unique)]
    pub email: String,
    #[sea_orm(unique)]
    pub username: String,
    pub password: String,
    pub verified: bool,
    pub role: Role,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::applications::Entity")]
    Applications,
    #[sea_orm(has_one = "super::verifications::Entity")]
    Verifications,
    #[sea_orm(has_many = "super::files::Entity")]
    Files,
}

impl Related<super::applications::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Applications.def()
    }
}

impl Related<super::verifications::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Verifications.def()
    }
}

impl Related<super::files::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Files.def()
    }
}

impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: Set(DB_SONYFLAKE.next_id().unwrap().to_string()),
            ..ActiveModelTrait::default()
        }
    }
}
