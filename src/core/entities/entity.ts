import { UniqueEntityId } from './value-objects/unique-entity-id'

/**
 * Entidade base do sistema, usada para gerar qualquer entidade do domínio que terá um ID único
 * As props são as propriedades específicas de cada entidade que estendem essa classe, protegidas para serem acessadas apenas pelas classes filhas
 * Para utilizar as props de forma segura, devemos sempre criar getters nas classes filhas
 * O ID é gerado automaticamente caso não seja passado no construtor
 */
export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  protected constructor(props: T, id?: UniqueEntityId) {
    // o construtor de uma entidade pode servir tanto para instanciar uma entidade já existente como criar uma nova entidade
    // por isso, podemos instanciar uma entidade nova (que ainda não tem ID) e no momento da criação definir seu ID
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id() {
    return this._id
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) return true

    if (entity.id.equals(this.id)) return true

    return false
  }
}
