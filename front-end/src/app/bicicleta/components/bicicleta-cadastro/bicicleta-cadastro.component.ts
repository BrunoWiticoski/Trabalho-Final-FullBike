import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BicicletaInterface } from '../../types/bicicleta.interface';
import { BicicletaService } from '../../services/bicicleta.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bicicleta-cadastro',
  templateUrl: './bicicleta-cadastro.component.html',
  styleUrls: ['./bicicleta-cadastro.component.scss'],
})
export class BicicletaCadastroComponent implements OnInit {
  bicicletaId: string | null;
  bicicletasForm: FormGroup;
  pessoas: string[] = [];
  medidaaro: string[] = ['12', '16', '20', '24', '26', '27,5', '29'];
  errorMessage: string = '';

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private bicicletaService: BicicletaService,
    private router: Router,
    private http: HttpClient
  ) {
    this.bicicletaId = null;
    this.bicicletasForm = this.createForm();
  }

  ngOnInit() {
    this.carregarPessoas();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.bicicletaId = id;
      this.carregarBicicletaParaEdicao(id);
    }
  }

  private carregarPessoas() {
    this.http.get<any[]>('http://localhost:5000/pessoas').subscribe(
      (pessoas: any[]) => {
        this.pessoas = pessoas.map(pessoa => pessoa.nome);
      },
      (error) => {
        console.error("Erro ao buscar pessoas:", error);
      }
    );
  }

  private carregarBicicletaParaEdicao(id: string) {
    this.bicicletaService.getBicicleta(id).subscribe(
      (bicicleta: BicicletaInterface | undefined) => {
        if (bicicleta) {
          this.bicicletasForm = this.createForm(bicicleta);
        } else {
          console.error("Bicicleta não encontrada.");
        }
      },
      (error) => {
        console.error("Erro ao buscar bicicleta:", error);
      }
    );
  }

  private createForm(bicicleta?: BicicletaInterface): FormGroup {
    return new FormGroup({
      nome: new FormControl(bicicleta?.nome || '', [
        Validators.required,
      ]),
      marca: new FormControl(bicicleta?.marca || '', [
        Validators.required,
      ]),
      modelo: new FormControl(bicicleta?.modelo || '', [
        Validators.required,
      ]),
      chassi: new FormControl(bicicleta?.chassi || '', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      cor: new FormControl(bicicleta?.cor || '', [
        Validators.required,
      ]),
      medidaaro: new FormControl(bicicleta?.medidaaro || '', [
        Validators.required,
      ]),
      ntf: new FormControl(bicicleta?.ntf || '', [
        Validators.required
      ])
    });
  }

  salvar() {
    if (this.bicicletasForm.invalid) {
      this.exibirToastErro('Por favor, preencha corretamente todos os campos do formulário.');
      return;
    }
  
    const bicicleta: BicicletaInterface = {
      ...this.bicicletasForm.value,
      id: this.bicicletaId
    };
  
    console.log('Dados enviados para salvar:', bicicleta);
  
    this.bicicletaService.salvar(bicicleta).subscribe(
      () => {
        this.router.navigate(['bicicleta']);
        this.bicicletaService.emitirBicicletasAtualizadas();
      },
      (erro) => {
        console.error('Erro ao salvar bicicleta:', erro);
        if (typeof erro === 'string') {
          this.errorMessage = erro;
        } else if (erro.error?.message) {
          if (Array.isArray(erro.error.message)) {
            this.errorMessage = erro.error.message.join(', ');
          } else {
            this.errorMessage = erro.error.message;
          }
        } else {
          this.errorMessage = 'Erro desconhecido ao salvar a bicicleta.';
        }
        this.exibirToastErro(this.errorMessage);
      }
    );
  }

  private async exibirToastErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 5000,
      keyboardClose: true,
      color: 'danger'
    });
    toast.present();
  }

  get nome() {
    return this.bicicletasForm.get('nome');
  }

  get chassi() {
    return this.bicicletasForm.get('chassi');
  }

  get ntf() {
    return this.bicicletasForm.get('ntf');
  }
}
