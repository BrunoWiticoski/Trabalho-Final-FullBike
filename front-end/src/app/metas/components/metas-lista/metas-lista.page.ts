import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { MetaInterface } from '../../types/metas.interface';
import { MetaService } from '../../services/metas.service';

@Component({
  selector: 'app-metas',
  templateUrl: './metas-lista.page.html',
  styleUrls: ['./metas-lista.page.scss'],
})
export class MetasListaComponent
  implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave
{
  metas: MetaInterface[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private metaService: MetaService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.listar();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnInit() {}

  listar() {
    console.log('Carregando lista de metas...');
    const observable = this.metaService.getMetas();
    observable.subscribe(
      (dados: MetaInterface[]) => {
        this.metas = dados.filter(meta => meta.nome !== undefined && meta.nome !== null && meta.nome !== '');
      },
      (erro: any) => {
        console.error('Erro ao carregar lista de metas:', erro);
        this.toastController
          .create({
            message: `Não foi possível listar os registros de metas`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }
  
  

  confirmarExclusao(meta: MetaInterface) {
    this.alertController
      .create({
        header: 'Confirmação de exclusão',
        message: `Deseja excluir o registro ${meta.nome}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => this.excluir(meta),
          },
          {
            text: 'Não',
          },
        ],
      })
      .then((alerta) => alerta.present());
  }

  private excluir(meta: MetaInterface) {
    if (meta.id) {
      this.metaService.excluir(meta.id).subscribe(
        () => this.listar(),
        (erro: any) => {
          console.error(erro);
          this.toastController
            .create({
              message: `Não foi possível excluir o registro  ${meta.nome}`,
              duration: 5000,
              keyboardClose: true,
              color: 'danger',
            })
            .then((t) => t.present());
        }
      );
    }
  }
}
