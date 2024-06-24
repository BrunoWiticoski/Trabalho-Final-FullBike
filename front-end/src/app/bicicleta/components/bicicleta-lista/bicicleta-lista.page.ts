import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { BicicletaInterface } from '../../types/bicicleta.interface';
import { BicicletaService } from '../../services/bicicleta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bicicletas-lista',
  templateUrl: './bicicleta-lista.page.html',
  styleUrls: ['./bicicleta-lista.page.scss'],
})
export class BicicletasListaComponent implements OnInit {
  bicicletas: BicicletaInterface[] = [];
  private atualizacaoSubscription: Subscription;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private bicicletaService: BicicletaService
  ) {
    this.atualizacaoSubscription = new Subscription();
  }

  ngOnInit() {
    this.listar();
    this.atualizacaoSubscription = this.bicicletaService.ouvirBicicletasAtualizadas().subscribe(() => {
      this.listar();
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
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

  ngOnDestroy() {
    this.atualizacaoSubscription.unsubscribe();
  }

  listar() {
    console.log('Carregando lista de bicicletas...');
    const observable = this.bicicletaService.getBicicletas();
    observable.subscribe(
      (dados: BicicletaInterface[]) => {
        this.bicicletas = dados.filter(bicicleta => bicicleta.nome !== undefined && bicicleta.nome !== null && bicicleta.nome !== '');
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível listar as bicicletas`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }

  confirmarExclusao(bicicleta: BicicletaInterface) {
    this.alertController
      .create({
        header: 'Confirmação de exclusão',
        message: `Deseja excluir o registro ${bicicleta.modelo}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => this.excluir(bicicleta),
          },
          {
            text: 'Não',
          },
        ],
      })
      .then((alerta) => alerta.present());
  }

  private excluir(bicicleta: BicicletaInterface) {
    if (bicicleta.id) {
      this.bicicletaService.excluir(bicicleta.id).subscribe(
        () => {
          this.bicicletaService.emitirBicicletasAtualizadas(); // Emitir evento de atualização
        },
        (erro) => {
          console.error(erro);
          this.toastController
            .create({
              message: `Não foi possível excluir a bicicleta ${bicicleta.nome}`,
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
